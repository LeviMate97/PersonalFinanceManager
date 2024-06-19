-- Table for Accounts
CREATE TABLE Accounts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AccountName VARCHAR(255) NOT NULL,
    AccountAmount DECIMAL(15, 2) NOT NULL
);

-- Table for Categories
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

-- Table for DailyBalanceSnapshots
CREATE TABLE DailyBalanceSnapshots (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SnapshotDate DATE NOT NULL,
    TotalBalance DECIMAL(15, 2) NOT NULL
);

-- Table for Transactions
CREATE TABLE Transactions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Date DATE NOT NULL,
    Account VARCHAR(255) NOT NULL,
    Place VARCHAR(255),
    Note TEXT,
    Category VARCHAR(255),
    Amount DECIMAL(15, 2) NOT NULL,
    Positive INT NOT NULL,
);


-- Insert data into Accounts
INSERT INTO Accounts (AccountName, AccountAmount) VALUES
('CASH', ROUND(RAND() * 1000, 2)),
('ING', ROUND(RAND() * 5000, 2)),
('CREDIT CARD', ROUND(RAND() * 2000, 2));

-- Insert data into Categories2
INSERT INTO Categories (Name) VALUES
('Grocery'),
('Fun'),
('Income'),
('Bills'),
('Savings'),
('Transport'),
('Dining Out'),
('Health');

-- Insert data into DailyBalanceSnapshots2
DECLARE @StartDate DATE = '2024-01-01';
DECLARE @EndDate DATE = GETDATE();
DECLARE @Date DATE = @StartDate;

WHILE @Date <= @EndDate
BEGIN
    INSERT INTO DailyBalanceSnapshots (SnapshotDate, TotalBalance)
    SELECT @Date, SUM(AccountAmount) + ROUND(RAND() * 1000, 2)
    FROM Accounts;

    SET @Date = DATEADD(DAY, 1, @Date);
END;

-- Insert data into Transactions2
DECLARE @CategoryCount INT = (SELECT COUNT(*) FROM Categories);
DECLARE @AccountCount INT = (SELECT COUNT(*) FROM Accounts);

DECLARE @i INT = 1;
DECLARE @TotalTransactions INT = 1000;

WHILE @i <= @TotalTransactions
BEGIN
    DECLARE @RandomDate DATE = DATEADD(DAY, ROUND(RAND() * 365, 0), '2024-01-01');
    DECLARE @RandomAccount VARCHAR(255) = (SELECT AccountName FROM Accounts ORDER BY NEWID() OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
    DECLARE @RandomCategory VARCHAR(255) = (SELECT Name FROM Categories ORDER BY NEWID() OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
    DECLARE @RandomAmount DECIMAL(15, 2) = ROUND(RAND() * 200, 2);
    DECLARE @Positive INT = CASE WHEN @RandomCategory = 'Income' THEN 1 ELSE 0 END;
    DECLARE @Place VARCHAR(255) = CASE WHEN @Positive = 1 THEN 'Employer' ELSE 'Store' END;
    DECLARE @Note VARCHAR(MAX) = 'Sample transaction note';

    INSERT INTO Transactions (Date, Account, Place, Note, Category, Amount, Positive)
    VALUES (@RandomDate, @RandomAccount, @Place, @Note, @RandomCategory, @RandomAmount, @Positive);

    SET @i = @i + 1;
END;
