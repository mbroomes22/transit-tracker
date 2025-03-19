require "net/http"
require "uri"

class Api::MbtaNewsUpdatesController < ApplicationController
  def index
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10
    offset = (page - 1) * per_page

    uri = URI.parse("https://api-v3.mbta.com/alerts")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      sorted_data = res["data"].sort_by { |alert| DateTime.parse(alert["attributes"]["created_at"]) }.reverse
      total_items = sorted_data.size
      paginated_data = sorted_data.slice(offset, per_page)

      alerts = {}
      paginated_data.each_with_index do |alert, idx|
        attributes = alert["attributes"]
        section_date = DateTime.parse(attributes["created_at"]).strftime("%B %d, %Y")
        section_summary = attributes["header"]
        section_title = attributes["effect"].gsub("_", " ").capitalize
        section_description = attributes["description"]
        alerts[idx] = {
          date: section_date,
          summary: section_summary,
          title: section_title,
          description: section_description
        }
      end
      render json: { alerts: alerts, total_items: total_items, page: page, per_page: per_page }
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end

  def show
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10
    offset = (page - 1) * per_page

    uri = URI.parse("https://api-v3.mbta.com/alerts?filter[route]=#{params[:train_line]}")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      total_items = res["data"].size
      paginated_data = res["data"].slice(offset, per_page)

      alerts = {}
      if paginated_data.empty?
        alerts = { 0 => { summary: "No alerts found for this train line." } }
      else
        paginated_data.each_with_index do |alert, idx|
          attributes = alert["attributes"]
          section_date = DateTime.parse(attributes["created_at"]).strftime("%B %d, %Y")
          section_summary = attributes["header"]
          section_title = attributes["effect"].gsub("_", " ").capitalize
          section_description = attributes["description"]
          alerts[idx] = {
            date: section_date,
            summary: section_summary,
            title: section_title,
            description: section_description
          }
        end
      end
      render json: { alerts: alerts, total_items: total_items, page: page, per_page: per_page }
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end
end
