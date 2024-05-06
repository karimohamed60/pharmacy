class ChangePrecisionOfPricePerUnit < ActiveRecord::Migration[7.0]
  def change
    change_column :medicines, :price_per_unit, :decimal, precision: 6, scale: 2, null: false
  end
end
