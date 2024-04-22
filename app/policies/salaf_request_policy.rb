class SalafRequestPolicy < ApplicationPolicy
    attr_reader :user, :salaf_request

    def initialize(user, salaf_request)
        @user = user
        @salaf_request = salaf_request
    end

    def index?
        user.admin? || user.pharmacy_agent? || user.salaf_agent?
    end

    def show?
        user.admin? || user.pharmacy_agent? || user.salaf_agent?
    end

    def create?
        user.admin? || user.pharmacy_agent?
    end

    def update?
        user.admin? || user.pharmacy_agent? || user.salaf_agent?
    end

    def destroy?
        user.admin?
    end
end