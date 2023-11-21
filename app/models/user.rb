class User < ApplicationRecord
  
  self.table_name = "users"

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  belongs_to :role, class_name: "Role"
  has_many :medicines, class_name: "Medicine"
  has_many :suppliers, class_name: "Supplier"
  has_many :invoices, class_name: "Invoice"
  has_many :orders, class_name: "Order"
  has_many :transfers, class_name: "Transfer"

end
