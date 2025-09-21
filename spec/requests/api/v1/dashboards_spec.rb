require 'rails_helper'

RSpec.describe "Api::V1::Dashboards", type: :request do
  describe "GET /" do
    let(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }

    it "returns http success for authenticated user" do
      get "/api/v1/dashboards", headers: { 'Authorization' => "Bearer #{token}" }
      expect(response).to have_http_status(:success)
    end
  end
end
