class ChangeMedicineNameToTextInSalafRequests < ActiveRecord::Migration[7.0]
  def change
    change_column :salaf_requests, :medicine_name, :text, null: false
  end
end
