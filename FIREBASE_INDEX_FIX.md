# Firebase Index Fix Instructions

The Firebase index errors you're seeing in the console are due to composite queries that require specific indexes. Here's how to fix them:

## Error Details

You're seeing errors like:
```
FirebaseError: The query requires an index. You can create it here: [URL]
```

These occur because Firestore requires composite indexes for queries with multiple `where` clauses or a combination of `where` and `orderBy` clauses.

## Solution Options

### Option 1: Automatic Index Creation (Recommended)

1. Click on any of the URLs provided in the error messages
2. This will take you to the Firebase Console where you can automatically create the required index
3. Click "Create Index" and wait for it to build (usually takes a few minutes)

### Option 2: Manual Index Creation

1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click "Create Index" 
3. Select "Collection" as the index type
4. Enter the collection name (e.g., "attempts" or "results")
5. Add the required fields with their sort orders:
   - For attempts: `userId` (ASC) and `startedAt` (DESC)
   - For results: `userId` (ASC) and `completedAt` (DESC)
6. Set query scope to "Collection"
7. Click "Create"

### Option 3: Use the Provided Configuration File

The `firebase.indexes.json` file in this project contains the required index definitions. You can deploy these indexes using the Firebase CLI:

```bash
firebase deploy --only firestore:indexes
```

## Index Requirements

The application requires the following composite indexes:

1. **attempts collection**:
   - Fields: `userId` (ASC), `startedAt` (DESC)
   - Used in: Student dashboard attempt history

2. **results collection**:
   - Fields: `userId` (ASC), `completedAt` (DESC)
   - Used in: Analytics and performance tracking

3. **quizzes collection**:
   - Fields: `createdBy` (ASC), `createdAt` (DESC)
   - Used in: Teacher dashboard quiz management

## Why These Indexes Are Needed

Firestore requires indexes for efficient query execution. Simple single-field queries use automatic indexes, but complex queries with multiple conditions require composite indexes to be explicitly defined.

The queries in this application filter by user ID and sort by date, which requires these composite indexes for optimal performance.