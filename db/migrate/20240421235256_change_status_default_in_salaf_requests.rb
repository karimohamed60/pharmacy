class ChangeStatusDefaultInSalafRequests < ActiveRecord::Migration[7.0]
  def change
    change_column_default :salaf_requests, :status, from: 1, to: 0
  end
end
