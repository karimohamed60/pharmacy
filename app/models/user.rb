class User < ApplicationRecord
  self.table_name = "users"

  include Devise::JWT::RevocationStrategies::JTIMatcher
  
  devise :database_authenticatable, :validatable, :registerable, :trackable,
         :rememberable, :jwt_authenticatable, jwt_revocation_strategy: self

  validates :username, presence: true, uniqueness: true 

  belongs_to :role, class_name: "Role"
  has_many :medicines, class_name: "Medicine"
  has_many :suppliers, class_name: "Supplier"
  has_many :invoices, class_name: "Invoice"
  has_many :orders, class_name: "Order"
  has_many :transfers, class_name: "Transfer"
  
  def email_required?
    false
  end

  def will_save_change_to_email?
    false
  end
end
