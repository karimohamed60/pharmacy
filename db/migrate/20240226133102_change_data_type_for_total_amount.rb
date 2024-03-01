class ChangeDataTypeForTotalAmount < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices do |t|
      t.change :total_amount, :float
    end
  end
end
