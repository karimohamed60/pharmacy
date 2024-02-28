class AddDefaultValueToTotalAmount < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices do |t|
      t.change :total_amount, :float, default: 0.0
    end
  end
end
