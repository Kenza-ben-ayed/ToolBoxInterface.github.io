<?php
require 'vendor/autoload.php'; // DOMPDF
use Dompdf\Dompdf;
use Dompdf\Options;

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get the viewer content
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['viewerContent'])) {
            throw new Exception("No viewer content provided.");
        }

        $viewerContent = $data['viewerContent'];

        // Add some basic styles to ensure proper rendering of the content
        $css = "
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; }
                .content-container { margin-bottom: 20px; }
                img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
                embed { width: 100%; height: 500px; display: block; margin: 0 auto; }
                .delete-icon { display: none; }
            </style>
        ";

        // Include the CSS at the top of the HTML content
        $htmlContent = $css . $viewerContent;

        // Ensure images and PDFs are accessible
        $htmlContent = preg_replace_callback('/src="(teacher_assets\/[^"]+)"/', function($matches) {
            return 'src="http://192.168.100.2/test/' . $matches[1] . '"';
        }, $htmlContent);

        // For PDF embeds, replace the embed tags with links (DOMPDF does not support PDF embedding)
        $htmlContent = preg_replace('/<embed.*?src="(teacher_assets\/[^"]+)".*?>/', function($matches) {
            return '<p>PDF File: <a href="http://192.168.100.2/test/' . $matches[1] . '" target="_blank">Download PDF</a></p>';
        }, $htmlContent);

        // Initialize DOMPDF
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $dompdf = new Dompdf($options);

        // Load HTML content
        $dompdf->loadHtml($htmlContent);

        // Set paper size
        $dompdf->setPaper('A4', 'portrait');

        // Render PDF
        $dompdf->render();

        // Save PDF to a file
        $output = $dompdf->output();
        $fileName = 'teacher_assets/final_viewer_' . time() . '.pdf';
        file_put_contents($fileName, $output);

        // Return the file URL to the client
        $pdfUrl = 'http://192.168.100.2/test/' . $fileName;
        echo json_encode(['url' => $pdfUrl]);

    } catch (Exception $e) {
        // Log and return error
        error_log("Error generating PDF: " . $e->getMessage());
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
