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
  
  def role_name
    role&.role_name
  end

  def admin?
    role_name == "admin"
  end

  def inventory_agent?
    role_name == "inventory_agent"
  end

  def pharmacy_agent?
    role_name == "pharmacy_agent"
  end

  def salaf_agent?
    role_name == "salaf_agent"
  end

  def email_required?
    false
  end

  def will_save_change_to_email?
    false
  end
end
