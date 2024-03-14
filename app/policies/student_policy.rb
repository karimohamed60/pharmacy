class StudentPolicy < ApplicationPolicy
  attr_reader :user, :student

  def initialize(user, student)
    @user = user
    @student = student
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
    user.admin?
  end

  def destroy?
    user.admin?
  end

  def search?
    user.admin? || user.pharmacy_agent? || user.salaf_agent?
  end
end
