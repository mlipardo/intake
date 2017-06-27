# frozen_string_literal: true

def run_commands(commands)
  commands.each { |command| system(command) }
end

namespace :docker do
  desc 'Runs docker-compose down, up, and all migrations'
  task :reup do
    run_commands [
      'docker-compose down',
      'docker-compose up -d',
      'docker-compose exec api bundle exec rake db:migrate',
      'docker-compose exec api bundle exec rake db:test:prepare',
      'docker-compose exec api bundle exec rake search:migrate'
    ]
  end
  desc 'Cleans docker of old dangling containers & images'
  task :clean do
    run_commands [
      'docker rm $(docker ps -q -f status=exited)',
      'docker rmi $(docker images -q -f dangling=true)',
      'docker volume rm $(docker volume ls -qf dangling=true)'
    ]
  end
  namespace :machine do
    desc 'Restarts and activates intake docker-machine'
    task :restart do
      system 'docker-machine restart intake && eval $(docker-machine env intake)'
    end
  end
end

namespace :logs do
  desc 'Show logs for ca_intake container'
  task :intake do
    system 'docker-compose logs -f ca_intake'
  end
  desc 'Show logs for api container'
  task :api do
    system 'docker-compose logs -f api'
  end
end

namespace :console do
  desc 'Start rails console in ca_intake container'
  task :intake do
    system 'docker-compose exec ca_intake bundle exec rails console'
  end

  desc 'Start rails console in api container'
  task :api do
    system 'docker-compose exec api bundle exec rails console'
  end
end
