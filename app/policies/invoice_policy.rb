class InvoicePolicy < ApplicationPolicy
  attr_reader :user, :invoice

  def initialize(user, invoice)
    @user = user
    @invoice = invoice
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
    user.admin?
  end

  def destroy?
    user.admin?
  end
end
