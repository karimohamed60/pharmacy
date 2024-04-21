class OrderPolicy < ApplicationPolicy
  attr_reader :user, :order

  def initialize(user, order)
    @user = user
    @order = order
  end

  def index?
    user.admin? || user.pharmacy_agent?
  end

  def show?
    user.admin? || user.pharmacy_agent?
  end

  def create?
    user.admin? || user.pharmacy_agent?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end
end