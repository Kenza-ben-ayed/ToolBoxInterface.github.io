<?php

// Define the directory where files will be stored
$targetDir = 'teacher_assets/';

// Check if a file has been uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    
    // Validate the file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Error uploading file']);
        exit;
    }

    // Get file information
    $fileName = basename($file['name']);
    $fileTmpPath = $file['tmp_name'];
    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);

    // Generate a unique filename to avoid conflicts
    $uniqueFileName = uniqid('file_', true) . '.' . $fileExt;
    $filePath = $targetDir . $uniqueFileName;

    // Move the uploaded file to the target directory
    if (move_uploaded_file($fileTmpPath, $filePath)) {
        // Return the file path to the client
        echo json_encode(['success' => true, 'filePath' => $filePath]);
    } else {
        echo json_encode(['error' => 'Failed to save file']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method or no file uploaded']);
}
?>
