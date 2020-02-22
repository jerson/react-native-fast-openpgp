
require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "8.0"
  s.source       = { :git => "https://github.com/jerson/react-native-fast-openpgp.git", :tag => "v#{s.version}" }
  s.source_files  = 'ios/*.{h,m}'
  s.requires_arc = true
  s.dependency "React"
  s.preserve_paths = 'ios/Openpgp.framework'
  s.xcconfig = { 'OTHER_LDFLAGS' => '-framework Openpgp' }
  s.vendored_frameworks = 'ios/Openpgp.framework'
end
