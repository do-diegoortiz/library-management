class ApplicationController < ActionController::API
  def authenticate_user_from_token
    token = request.headers["Authorization"]&.split(" ")&.last
    if token
      begin
        decoded = JsonWebToken.decode(token)
        @current_user = User.find(decoded["user_id"])
      rescue
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    else
      render json: { error: "No token" }, status: :unauthorized
    end
  end

  def authenticate_user!
    authenticate_user_from_token
  end

  def current_user
    @current_user
  end
end
