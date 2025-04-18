class CreateTrips < ActiveRecord::Migration[8.0]
  def change
    create_table :trips do |t|
      t.string :origin
      t.string :destination
      t.date :start_date
      t.date :end_date
      t.text :route
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
