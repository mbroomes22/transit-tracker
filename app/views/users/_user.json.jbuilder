json.extract! user, :id, :name, :email, :phone, :hometown, :zipcode, :created_at, :updated_at
json.url user_url(user, format: :json)
