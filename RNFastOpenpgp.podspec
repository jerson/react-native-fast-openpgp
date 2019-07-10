
require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNFastOpenpgp"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.description  = <<-DESC
                  RNFastOpenpgp
                   DESC
  s.homepage     = "https://github.com/jerson/react-native-fast-openpgp"
  s.author       = { "author" => "jeral17@gmail.com" }
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/jerson/react-native-fast-openpgp.git", :tag => "master" }
  s.source_files  = 'ios/**/*.{h,m}'
  s.requires_arc = true

  s.dependency "React"
  s.dependency "FastOpenpgp"
  
  #s.subspec "FastOpenpgp" do |o|
  #o.name              = 'FastOpenpgp'
  #o.platform          = :ios
  #o.ios.deployment_target = '8.0'
  #o.ios.vendored_frameworks = 'ios/native/openpgp.framework'
  #end
  
end
