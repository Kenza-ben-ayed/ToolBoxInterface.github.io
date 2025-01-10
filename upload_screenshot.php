<?php

// Define the directory where screenshots will be stored
$targetDir = 'teacher_assets/';

// Check if the POST request contains image data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['imageData']) || empty($data['imageData'])) {
        echo json_encode(['error' => 'No image data received']);
        exit;
    }

    // Extract the base64 image data (remove the "data:image/png;base64," prefix)
    $base64Image = $data['imageData'];
    $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));

    // Generate a unique filename for the image
    $fileName = 'screenshot_' . time() . '.png';
    $filePath = $targetDir . $fileName;

    // Save the image to the target directory
    if (file_put_contents($filePath, $imageData)) {
        // Return the file path for use in the frontend
        echo json_encode(['success' => true, 'filePath' => $filePath]);
    } else {
        echo json_encode(['error' => 'Failed to save image']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
