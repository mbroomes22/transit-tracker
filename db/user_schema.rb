ActiveRecord::Schema[7.1].define(version: 1) do
  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone", null: false
    t.string "hometown", null: false
    t.string "zipcode", null: false
    t.datetime "created_at", null: false
    t.datetime "last_update", null: false
  end
end

# has_many trips