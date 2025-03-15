require "net/http"
require "uri"

class Api::MbtaNewsUpdatesController < ApplicationController
  def index
    uri = URI.parse("https://api-v3.mbta.com/alerts")
    request = Net::HTTP::Get.new(uri)
    # request["Accept"] = "application/json"
    # request["Authorization"] = "Bearer #{ENV['MOBILITY_DATABASE_API_KEY']}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      render json: JSON.parse(response.body)
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end

  def show
    uri = URI.parse("https://api-v3.mbta.com/alerts?filter[route]=#{params[:train_line]}")
    request = Net::HTTP::Get.new(uri)
    # request["Accept"] = "application/json"
    # request["Authorization"] = "Bearer #{ENV['MOBILITY_DATABASE_API_KEY']}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      render json: JSON.parse(response.body)
    else
      render json: { error: "Failed to fetch data" }, status: :bad_request
    end
  end
end
