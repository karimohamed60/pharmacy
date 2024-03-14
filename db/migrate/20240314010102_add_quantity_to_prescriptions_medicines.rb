class AddQuantityToPrescriptionsMedicines < ActiveRecord::Migration[7.0]
  def change
    add_column :prescriptions_medicines, :quantity, :integer, default: 0
  end
end
