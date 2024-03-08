class ChangeDefaultStatusForTransfers < ActiveRecord::Migration[7.0]
  def change
    change_column_default :transfers, :status, 0
  end
end
