require "net/http"
require "uri"

class Api::MbtaNewsUpdatesController < ApplicationController
  def index
    uri = URI.parse("https://api-v3.mbta.com/alerts")
    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      alerts = {}
      res["data"].each_with_index do |alert, idx|
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
      render json: alerts
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end

  def show
    uri = URI.parse("https://api-v3.mbta.com/alerts?filter[route]=#{params[:train_line]}")

    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      res = JSON.parse(response.body)
      alerts = {}
      res["data"].each_with_index do |alert, idx|
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
      render json: alerts
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end
end
