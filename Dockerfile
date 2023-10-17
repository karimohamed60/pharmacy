# Use an official Ruby runtime as a parent image
FROM ruby:3.2.2

# Common dependencies
RUN apt-get update -qq \
  && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends \
    build-essential \
    gnupg2 \
    curl \
    less \
    git \
    libsqlite3-dev \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

# Install bundler gem
RUN gem install bundler 

# Set the working directory
WORKDIR /app

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install any needed gems specified in the Gemfile
RUN bundle install

# Copy the rest of the application code
COPY . /app

# Expose port 4000 to the Docker host
EXPOSE 4000


# Start the Rails application
CMD rm -f tmp/pids/server.pid && rails s -b '0.0.0.0' -p 4000
