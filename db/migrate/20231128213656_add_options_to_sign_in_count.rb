class AddOptionsToSignInCount < ActiveRecord::Migration[7.0]
  def change
    change_column :users, :sign_in_count, :integer, default: 0
  end
end
