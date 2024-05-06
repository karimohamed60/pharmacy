class Api::V1::Auth::SessionsController < Devise::SessionsController
  include RackSessionsFix
  respond_to :json

  def destroy
    if user_signed_in?
      sign_out(current_user)
    else
      return false
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  def respond_to_on_destroy
    unless destroy
      render json: { error: "Couldn't find an active session." }, status: :unauthorized
    end
  end
end