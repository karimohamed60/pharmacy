class MedicinePolicy < ApplicationPolicy
  attr_reader :user, :medicine

  def initialize(user, medicine)
    @user = user
    @medicine = medicine
  end

  def index?
    user.admin? || user.inventory_agent? || user.pharmacy_agent?
  end

  def show?
    user.admin? || user.inventory_agent? || user.pharmacy_agent?
  end

  def create?
    user.admin? || user.inventory_agent?
  end

  def update?
    user.admin? || user.inventory_agent?
  end

  def destroy?
    user.admin?
  end
end
