class SupplierPolicy < ApplicationPolicy
  attr_reader :user, :supplier

  def initialize(user, supplier)
    @user = user
    @supplier = supplier
  end

  def index?
    user.admin? || user.inventory_agent?
  end

  def show?
    user.admin? || user.inventory_agent?
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