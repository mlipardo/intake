# frozen_string_literal: true

require 'rails_helper'

describe QueryBuilder do
  describe '.is_client_only?' do
    context 'is_client_only is true' do
      it 'return true' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return true' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.is_client_only).to be true
      end
    end

    context 'is_client_only is blank' do
      it 'return false' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.is_client_only).to be false
      end
    end
  end
  describe '.must' do
    context 'is_client_only is true' do
      before(:each) do
        Rails.configuration.intake[:client_only_search] = true
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last).to \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.must.last).to \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.last).to \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end
    end

      context 'is_client_only is false' do
        before(:each) do
          Rails.configuration.intake[:client_only_search] = false
        end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "true"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'true')
        expect(qb.must.last).to \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only blank' do
        qb = described_class.new(search_term: 'hello')
        expect(qb.must.last).to  \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end

      it 'return match for legacy with table name "CLIENT_T" if is_client_only "false"' do
        qb = described_class.new(search_term: 'hello', is_client_only: 'false')
        expect(qb.must.last).not_to  \
          include({
            match: { :"legacy_descriptor.legacy_table_name"=> "CLIENT_T"}
          })
      end
    end
  end
end
