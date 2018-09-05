# frozen_string_literal: true

require 'capybara/rspec'
require 'support/capybara/screenshot'
require 'capybara/accessible'
require 'selenium-webdriver'

# Tests must be run in the correct timezone because
# of UTC converstion and explicit expectations.
# Sincerely,
# The Time Lords

Capybara.register_driver :accessible_selenium do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.firefox(
    marionette: ENV['MARIONETTE'] == 'true'
  )
  driver = Capybara::Selenium::Driver.new(
    app,
    browser: :firefox,
    desired_capabilities: capabilities
  )
  adaptor = Capybara::Accessible::SeleniumDriverAdapter.new
  Capybara::Accessible.setup(driver, adaptor)
end

Capybara.register_driver :accessible_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: {
      args: [
        'headless',
        'disable-gpu',
        'no-sandbox',
        'disable-dev-shm-usage',
        'incognito',
        'window-size=2500,2500'
      ]
    }
  )

  driver = Capybara::Selenium::Driver.new app,
    browser: :chrome,
    desired_capabilities: capabilities
  adaptor = Capybara::Accessible::SeleniumDriverAdapter.new
  Capybara::Accessible.setup(driver, adaptor)
end

Capybara.register_driver :accessible_selenium_chrome do |app|
  redux_devtools = ENV.fetch('REDUX_DEVTOOLS', false)
  react_devtools = ENV.fetch('REACT_DEVTOOLS', false)
  redux_devtools_location = redux_devtools ? '../redux-devtools-extension/build/extension' : nil
  react_devtools_location = react_devtools ? '../react-devtools/shells/chrome/build/unpacked' : nil
  extensions = []
  extensions << redux_devtools_location if redux_devtools_location
  extensions << react_devtools_location if react_devtools_location
  switches = if extensions.empty?
               []
             else
               ['--load-extension=' + extensions.join(',')]
             end
  driver = Capybara::Selenium::Driver.new(
    app,
    browser: :chrome,
    switches: switches
  )
  adaptor = Capybara::Accessible::SeleniumDriverAdapter.new
  Capybara::Accessible.setup(driver, adaptor)
end

Capybara.register_server :puma do |app, port, host|
  require 'rack/handler/puma'
  Rack::Handler::Puma.run(app, Host: host, Port: port, Threads: '10:10', config_files: [])
end

Capybara.server = :puma

Capybara.default_driver = ENV.fetch('DEFAULT_DRIVER', :accessible_chrome).to_sym

Capybara.server_port = 8889 + ENV['TEST_ENV_NUMBER'].to_i
Capybara.raise_server_errors = true

# Allow aria-label to be used in locators
Capybara.enable_aria_label = true

Capybara.default_max_wait_time = 10

module Capybara
  module Accessible
    class SeleniumDriverAdapter
      def modal_dialog_present?(driver)
        driver.browser.switch_to.alert
        true
      rescue ::Selenium::WebDriver::Error::UnhandledAlertError,
             ::Selenium::WebDriver::Error::NoSuchAlertError,
             ::NoMethodError
        false
      end
    end
  end
end

# Hack to increase the timeout for launching firefox
module Selenium
  module WebDriver
    module Firefox
      class Launcher
        remove_const(:SOCKET_LOCK_TIMEOUT)
      end
    end
  end
end

::Selenium::WebDriver::Firefox::Launcher::SOCKET_LOCK_TIMEOUT = 90

Capybara::Accessible::Auditor::Node.class_eval do
  SELECTORS_TO_IGNORE = <<-IGNORES
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_cal]');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_input]');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_time_listbox]');
    config.ignoreSelectors('badAriaAttributeValue', '[id=spec_meta]');
    config.ignoreSelectors('badAriaAttributeValue', '[id=spec_meta]');
    config.ignoreSelectors('badAriaAttributeValue', '[class^=Select]');
    config.ignoreSelectors('badAriaAttributeValue', 'option');
  IGNORES

  def perform_audit_script
    <<-JAVASCRIPT
    #{audit_rules}
        var config = new axs.AuditConfiguration();
        var severe_rules = #{severe_rules.to_json};
        var rule;
        for(rule in severe_rules) {
          config.setSeverity(severe_rules[rule], axs.constants.Severity.SEVERE);
        }
        config.auditRulesToIgnore = #{excluded_rules.to_json};
        #{SELECTORS_TO_IGNORE}
        var results = axs.Audit.run(config);
    JAVASCRIPT
  end
end

Capybara::Accessible::Auditor::Driver.class_eval do
  def perform_audit_script
    <<-JAVASCRIPT
    #{audit_rules}
        var config = new axs.AuditConfiguration();
        var severe_rules = #{severe_rules.to_json};
        var rule;
        for(rule in severe_rules) {
          config.setSeverity(severe_rules[rule], axs.constants.Severity.SEVERE);
        }
        config.auditRulesToIgnore = #{excluded_rules.to_json};
        #{SELECTORS_TO_IGNORE}
        var results = axs.Audit.run(config);
    JAVASCRIPT
  end
end
