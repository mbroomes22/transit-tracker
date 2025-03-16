require "net/http"
require "uri"

class Api::MbtaScheduleController < ApplicationController
  def index
    route = params[:filter][:route]
    uri = URI.parse("https://api-v3.mbta.com/schedules?filter[route]=#{route}")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      schedule_data = {}
      res["data"].each_with_index do |schedule, idx|
        attributes = schedule["attributes"]
        stop_id = schedule["relationships"]["stop"]["data"]["id"]

        arrival_time = attributes["arrival_time"].present? ? DateTime.parse(attributes["arrival_time"]).strftime("%B %d, %Y | %I:%M%p") : nil
        departure_time = attributes["departure_time"].present? ? DateTime.parse(attributes["departure_time"]).strftime("%B %d, %Y | %I:%M%p") : nil
        direction_id = attributes["direction_id"]
        route_arr = route_lines(route, direction_id) # train_direction, train_destination
        stop_sequence_num = attributes["stop_sequence"]
        stops_name = stops(stop_id) # stops_name
        stop_headsign = attributes["stop_headsign"]

        # arrival_time, departure_time, train_direction, train_destination, stop_sequence_num, stops_name, stop_headsign
        schedule_data[idx] = {
          arrival_time: arrival_time,
          departure_time: departure_time,
          train_direction: route_arr[0],
          train_destination: route_arr[1],
          stop_sequence_num: stop_sequence_num,
          stops_name: stops_name,
          stop_headsign: stop_headsign
        }
      end
      render json: schedule_data
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end

  def route_lines(route, direction_id)
    uri = URI.parse("https://api-v3.mbta.com/routes/#{route}")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      array = []
      binding.pry
      array << res["data"]["attributes"]["direction_names"][direction_id] # direction
      array << res["data"]["attributes"]["direction_destinations"][direction_id] # destination of train
      array
    else
      nil
    end
  end

  def stops(stop_id)
    uri = URI.parse("https://api-v3.mbta.com/stops/#{stop_id}")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      binding.pry if stop_id == "32501" || stop_id == "312"
      res["data"]["attributes"]["name"] # stop_name
    else
      nil
    end
  end
end

# Example response:
# "arrival_time" => "2025-03-15T18:33:00-04:00", Time when the trip arrives at the given stop. Format is ISO8601.
#  "departure_time" => "2025-03-15T18:33:00-04:00", Time when the trip departs the given stop. Format is ISO8601.
#  "direction_id" => 1, Direction in which trip is traveling: 0 or 1. get the direction names from /routes/{id} /data/attributes/direction_names.
#  "drop_off_type" => 0, How the vehicle arrives at stop_id.
#  "pickup_type" => 0, How the vehicle departs from stop_id.
#  "stop_headsign" => nil, Text identifying destination of the trip, overriding trip-level headsign if present.
#  "stop_sequence" => 3, The sequence the stop_id is arrived at during the trip_id. The stop sequence is monotonically increasing along the trip, but the stop_sequence along the trip_id are not necessarily consecutive.
#  "timepoint" => false, boolean where true is exact times and false is estimated times.
#
#  "direction_names" => "Outbound"
#  "direction_destinations" => "Ashmont Station"
#
#  "name" => "Wonderland"



# schedules => data => relationships => stop => data => id
# schedules => data => relationships => route => data => id
