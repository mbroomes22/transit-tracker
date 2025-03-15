require "net/http"
require "uri"

class Api::MbtaScheduleController < ApplicationController
  def index
    uri = URI.parse("https://api.mobilitydatabase.org/v1/metadata")
    request = Net::HTTP::Get.new(uri)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{ENV['MOBILITY_DATABASE_API_KEY']}"

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
