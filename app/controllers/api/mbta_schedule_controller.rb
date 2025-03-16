require "net/http"
require "uri"

class Api::MbtaScheduleController < ApplicationController
    def index
      route = params[:filter][:route]
      uri = URI.parse("https://api-v3.mbta.com/schedules?include=stop,route&filter[route]=#{route}")
      request = Net::HTTP::Get.new(uri)

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
        http.request(request)
      end

      if response.is_a?(Net::HTTPSuccess)
        res = JSON.parse(response.body)
        if res["data"].empty?
          render json: { error: "No schedules found for this route." }, status: :no_content
        else
          schedule_res = res["data"]
          extra_info = res["included"]
          # route info
          route_res = extra_info.select { |info| info["type"] == "route" }
          route = {}
          route["direction_destinations"] = route_res[0]["attributes"]["direction_destinations"]
          route["direction_names"] = route_res[0]["attributes"]["direction_names"]

          # stop info
          stop = {}
          stops_res = extra_info.select { |info| info["type"] == "stop" }
          stops_res.each do |stop_row|
            # find stop name by id number
            stop[stop_row["links"]["self"].gsub(/\D/, "")] = stop_row["attributes"]["name"]
          end

          # schedule info
          schedule_data = []

          schedule_res.each_with_index do |schedule, idx|
            single_rte_stop_data = {}
            arrival_time = schedule["attributes"]["arrival_time"].present? ? DateTime.parse(schedule["attributes"]["arrival_time"]).strftime("%B %d, %Y | %I:%M%p") : nil
            departure_time = schedule["attributes"]["departure_time"].present? ? DateTime.parse(schedule["attributes"]["departure_time"]).strftime("%B %d, %Y | %I:%M%p") : nil
            # fill out single stop data before inserting into schedule_data array
            single_rte_stop_data["arrival_time"] = arrival_time
            single_rte_stop_data["departure_time"] = departure_time
            single_rte_stop_data["train_direction"] = route["direction_names"][schedule["attributes"]["direction_id"]]
            single_rte_stop_data["train_destination"] = route["direction_destinations"][schedule["attributes"]["direction_id"]]
            single_rte_stop_data["stop_sequence_num"] = schedule["attributes"]["stop_sequence"]
            single_rte_stop_data["current_stop_name"] = stop[schedule["relationships"]["stop"]["data"]["id"]]
            schedule_data << single_rte_stop_data
          end
          render json: schedule_data
        end
      else
        render json: { error: "Failed to fetch data" }, status: :bad_request
      end
    end
end

# Example response:
#  schedules:
#  "arrival_time" => "2025-03-15T18:33:00-04:00", Time when the trip arrives at the given stop. Format is ISO8601.
#  "departure_time" => "2025-03-15T18:33:00-04:00", Time when the trip departs the given stop. Format is ISO8601.
#  "direction_id" => 1, Direction in which trip is traveling: 0 or 1. get the direction names from /routes/{id} /data/attributes/direction_names.
#  "stop_sequence" => 3, The sequence the stop_id is arrived at during the trip_id. The stop sequence is monotonically increasing along the trip, but the stop_sequence along the trip_id are not necessarily consecutive.
#
#
#  routes: (only need to reach once for the route)
#  "direction_names" => "Outbound"
#  "direction_destinations" => "Ashmont Station"
#
#  stops: (need to reach for every stop_id)
#  "name" => "Wonderland"



# schedules => data => relationships => stop => data => id
# schedules => data => relationships => route => data => id
