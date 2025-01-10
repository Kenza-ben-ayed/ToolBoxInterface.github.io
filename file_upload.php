<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = 'teacher_assets/';
    $fileName = time() . '_' . basename($_FILES['file']['name']);
    $uploadFile = '/test/'.$uploadDir . $fileName;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        $fileUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/' . $uploadFile;
        echo json_encode(['url' => $fileUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'File upload failed']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
}
