import 'package:image_picker/image_picker.dart';

/// Thin wrapper around image_picker for camera and gallery access.
class CameraService {
  final ImagePicker _picker = ImagePicker();

  /// Capture a photo from the camera and return the file path.
  /// Returns null if the user cancels.
  Future<String?> capturePhoto() async {
    final XFile? photo = await _picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );
    return photo?.path;
  }

  /// Pick an image from the gallery and return the file path.
  /// Returns null if the user cancels.
  Future<String?> pickFromGallery() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );
    return image?.path;
  }
}
