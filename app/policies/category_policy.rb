class CategoryPolicy < ApplicationPolicy
  attr_reader :user, :category

  def initialize(user, category)
    @user = user
    @category = category
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