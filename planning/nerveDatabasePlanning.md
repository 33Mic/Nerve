# Planning the database

This document will focus on how I'm going to tackle the database problem, and how I will organize a user's challenges or status or such.

## Data to collect

- User ID
- User challenge (new one will be generated on a daily (Time zone)basis)
- User bailed? (T/F)
- Challenge end date/time
- Challenges completed
- Challenge streak

## How will the data be handled?

The challenges will always persist until they have been verified by either staff or a model.

## How will the data be organized?

For efficiency's sake (and for more experience with databases), we will organize this into 2 tables:

- Users
  - This table will store the necessary user information (excluding authentication-related), including:
    - USERID **(PRIMARY KEY)**
    - User bailed?
    - Current User Challenge ID
    - Challenges Completed
    - Challenge Streak (For user retention)
- Challenges
  - This table will store the challenge details:
    - CHALLENGEID **(PRIMARY KEY)**
    - USERID **(FOREIGN KEY)**
    - Challenge Completed
    - Challenge end date/time
    - Challenge Text
    - Challenge Location Area
    - Corresponding video URL in database

### Obstacles

- For the 24 hours in the day (based on a user's location), they will remain in the database.
- However, after the 24 hours have passed:
  - If the user has not submitted one, the challenge will be deleted.
  - If the user HAS submitted one, it will persist until verified, where it will then be deleted (and challenges completed counter is incremented).

## Conclusion

This should be enough details in order to implement a working database to pull from and add user details and submissions. With this, the MVP should be ready. From there-on, we can commence stage 3 (Beta-testing, Advertising, UI Touch-ups, and full project release).
