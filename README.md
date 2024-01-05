## Scriba Server Development


### References

References for Data Migration: [dbmate](https://github.com/amacneil/dbmate).

For db connection reference [dbmate](https://github.com/amacneil/dbmate?tab=readme-ov-file#connecting-to-the-database).

### Before you Start
Don't forget to go to the scriba-server directory:

Run the following command:

This is important!
```

npm install 
```

### .env variables
```
JWT_ACCESS_SECRET="YourSecret"

# Example: protocol://username:password@host:port/database_name?options
# Don't remove the sslmode=disable as this is the default command

DATABASE_URL="postgres://postgres:my_password@localhost:5432/scriba-development?sslmode=disable"
```

Ask for the .env files from scrum master as they are needed for you to continue this step.
### Important Step! 
For starter:
This commands are needed to start your development

Automatically create database
```
npx dbmate create
```
This creates the db table for you
```
npx dbmate up
```

