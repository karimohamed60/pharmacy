class PrescriptionPolicy < ApplicationPolicy
  attr_reader :user, :prescription

  def initialize(user, prescription)
    @user = user
    @prescription = prescription
  end

  def index?
    user.admin? || user.pharmacy_agent?
  end

  def show?
    user.admin? || user.pharmacy_agent?
  end

  def create?
    user.admin?
  end

  def update?
    user.admin? || user.pharmacy_agent?
  end

  def destroy?
    user.admin?
  end
end
