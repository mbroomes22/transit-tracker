# frozen_string_literal: true

ActiveRecord::Schema[7.2].define(version: 1) do
  create_table "trips", force: :cascade do |t|
    t.string "route", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "starting_address", null: false
    t.text "ending_address", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_trips_on_user_id"
  end
end

# has_one user