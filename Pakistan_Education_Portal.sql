CREATE TABLE [tbl_user] (
  [userID] bigint PRIMARY KEY,
  [email] varcahr(50),
  [password] varcahr(50),
  [profile_pic_eDoc] varchar(50),
  [userRoleID] int
)
GO

CREATE TABLE [tbl_user_role] (
  [userRoleID] int PRIMARY KEY,
  [userID] bigint,
  [roleID] int
)
GO

CREATE TABLE [tbl_role] (
  [roleID] int PRIMARY KEY,
  [roleTitle] varchar(50)
)
GO

CREATE TABLE [tbl_user_personal_info] (
  [userPersonalInfoID] bigint PRIMARY KEY,
  [userID] bigint,
  [fullname] varchar(50),
  [fatherName] varchar(50),
  [cnic] varchar(15),
  [phoneNumber] varchar(15),
  [dateOfBirth] date,
  [address] varchar(50),
  [country] varchar(15),
  [city] varchar(15),
  [language] varchar(15),
  [religion] varchar(15),
  [eDoc] varchar(50)
)
GO

CREATE TABLE [tbl_user_education] (
  [userEducationID] bigint PRIMARY KEY,
  [userID] bigint,
  [institutationName] varchar(50),
  [degree] varchar(50),
  [courseName] varchar(50),
  [eDoc] varchar(50),
  [educationTypeID] int
)
GO

CREATE TABLE [tbl_education_type] (
  [educationTypeID] int PRIMARY KEY,
  [educationTypeTitle] varchar(50)
)
GO

CREATE TABLE [tbl_university] (
  [uniID] bigint PRIMARY KEY,
  [enteredBy] bigint,
  [universityName] nvarchar(255),
  [eDoc] varchar(50),
  [tuitionFee] varchar(50),
  [studyLevel] varchar(50),
  [enteredDate] date
)
GO

CREATE TABLE [tbl_application] (
  [applicationID] bigint PRIMARY KEY,
  [userID] bigint,
  [programId] bigint,
  [applicationDate] date,
  [status] varchar(50)
)
GO

CREATE TABLE [tbl_campus] (
  [campusID] bigint PRIMARY KEY,
  [uniId] bigint,
  [cityID] bigint UNIQUE,
  [campusName] varchar(50)
)
GO

CREATE TABLE [tbl_program] (
  [programID] bigint PRIMARY KEY,
  [uniID] bigint,
  [campusId] bigint,
  [degID] bigint,
  [programName] varchar(50),
  [degreeLevel] varchar(50),
  [applicationFee] varchar(50),
  [duration] varchar(50)
)
GO

CREATE TABLE [tbl_city] (
  [cityID] bigint PRIMARY KEY,
  [cityName] varchar(50)
)
GO

CREATE TABLE [tbl_campus_program] (
  [campusProgramID] bigint PRIMARY KEY,
  [campusID] bigint,
  [programID] bigint,
  [tuitionFee] decimal(10,2)
)
GO

CREATE TABLE [tbl_contactInfo] (
  [contactID] bigint PRIMARY KEY,
  [uniID] bigint,
  [employeeName] varchar(255),
  [designation] varchar(255),
  [email] varchar(255),
  [contact] varchar(50),
  [whatsApp] varchar(50)
)
GO

CREATE TABLE [tbl_AboutUs] (
  [aboutID] bigint PRIMARY KEY,
  [heading] varchar(50),
  [description] varchar(255),
  [eDoc] varchar(50)
)
GO

CREATE TABLE [tbl_degree] (
  [degreeID] bigint PRIMARY KEY,
  [degreeTitle] varchar(50)
)
GO

CREATE UNIQUE INDEX [tbl_campus_program_index_0] ON [tbl_campus_program] ("campusID", "programID")
GO

ALTER TABLE [tbl_user] ADD FOREIGN KEY ([userRoleID]) REFERENCES [tbl_user_role] ([userRoleID])
GO

ALTER TABLE [tbl_user_role] ADD FOREIGN KEY ([userID]) REFERENCES [tbl_user] ([userID])
GO

ALTER TABLE [tbl_user_role] ADD FOREIGN KEY ([roleID]) REFERENCES [tbl_role] ([roleID])
GO

ALTER TABLE [tbl_user_personal_info] ADD FOREIGN KEY ([userID]) REFERENCES [tbl_user] ([userID])
GO

ALTER TABLE [tbl_user_education] ADD FOREIGN KEY ([userID]) REFERENCES [tbl_user] ([userID])
GO

ALTER TABLE [tbl_user_education] ADD FOREIGN KEY ([educationTypeID]) REFERENCES [tbl_education_type] ([educationTypeID])
GO

ALTER TABLE [tbl_university] ADD FOREIGN KEY ([enteredBy]) REFERENCES [tbl_user] ([userID])
GO

ALTER TABLE [tbl_application] ADD FOREIGN KEY ([userID]) REFERENCES [tbl_user] ([userID])
GO

ALTER TABLE [tbl_application] ADD FOREIGN KEY ([programId]) REFERENCES [tbl_program] ([programID])
GO

ALTER TABLE [tbl_campus] ADD FOREIGN KEY ([uniId]) REFERENCES [tbl_university] ([uniID])
GO

ALTER TABLE [tbl_campus] ADD FOREIGN KEY ([cityID]) REFERENCES [tbl_city] ([cityID])
GO

ALTER TABLE [tbl_program] ADD FOREIGN KEY ([uniID]) REFERENCES [tbl_university] ([uniID])
GO

ALTER TABLE [tbl_program] ADD FOREIGN KEY ([campusId]) REFERENCES [tbl_campus] ([campusID])
GO

ALTER TABLE [tbl_program] ADD FOREIGN KEY ([degID]) REFERENCES [tbl_degree] ([degID])
GO

ALTER TABLE [tbl_campus_program] ADD FOREIGN KEY ([campusID]) REFERENCES [tbl_campus] ([campusID])
GO

ALTER TABLE [tbl_campus_program] ADD FOREIGN KEY ([programID]) REFERENCES [tbl_program] ([programID])
GO

ALTER TABLE [tbl_contactInfo] ADD FOREIGN KEY ([uniID]) REFERENCES [tbl_university] ([uniID])
GO
