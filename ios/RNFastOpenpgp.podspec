
Pod::Spec.new do |s|
  s.name         = "RNFastOpenpgp"
  s.version      = "0.1.0"
  s.summary      = "RNFastOpenpgp"
  s.description  = <<-DESC
                  RNFastOpenpgp
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  s.author             = { "author" => "jeral17@gmail.com" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/jerson/react-native-fast-openpgp.git", :tag => "master" }
  s.source_files  = "*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  