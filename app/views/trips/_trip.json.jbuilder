json.extract! trip, :id, :origin, :destination, :start_date, :end_date, :route, :user_id, :created_at, :updated_at
json.url trip_url(trip, format: :json)
