class TransferPolicy < ApplicationPolicy
  attr_reader :user, :transfer

  def initialize(user, transfer)
    @user = user
    @transfer= transfer
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
