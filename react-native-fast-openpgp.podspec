require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/jerson/react-native-fast-openpgp.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{h,cpp}"
  s.vendored_libraries  = '*.a'
  s.xcconfig = { 'OTHER_LDFLAGS' => '-force_load "/Users/usuario/Proyectos/react-native-fast-openpgp/ios/libopenpgp_bridge.a"'}
  s.pod_target_xcconfig = {  'DEFINES_MODULE' => 'YES', 'VALID_ARCHS[sdk=iphonesimulator*]' => 'x86_64' }
  s.dependency "React-Core"
end
