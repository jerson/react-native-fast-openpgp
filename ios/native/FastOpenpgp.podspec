Pod::Spec.new do |s|  
    s.name              = 'FastOpenpgp'
    s.version           = '1.0.0'
    s.summary           = 'Openpgp native'
    s.homepage          = 'https://github.com/jerson/openpgp-mobile'

    s.author            = { 'Name' => 'me@jerson.dev' }
    s.license           = { :type => 'Apache-2.0' }

    s.platform          = :ios
    s.source            = { :http => 'https://github.com/jerson/openpgp-mobile/files/3374741/openpgp.framework.zip' }

    s.ios.deployment_target = '8.0'
    s.ios.vendored_frameworks = 'openpgp.framework'
end  
