OUTPUTDIR="./buildTemp"
APPNAME=$(date +'FunkRockTest'%Y-%m-%d-%H-%M-%S)
SCHEME="FunkRock_Test"
APP_PROJECTPATH="./ios/FunkRock.xcodeproj"

/usr/libexec/PlistBuddy -c "Merge ./ios/FunkRock/test.plist" "./ios/FunkRock/Info.plist"

rm "$OUTPUTDIR/$APPNAME/$SCHEME.ipa"
xcodebuild -project "$APP_PROJECTPATH" -scheme "$SCHEME" archive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -quiet
xcodebuild -exportArchive -archivePath "$OUTPUTDIR/$APPNAME.xcarchive" -exportPath "$OUTPUTDIR/$APPNAME" -exportOptionsPlist "exportOptions.plist" -quiet

curl -F "file=@$OUTPUTDIR/$APPNAME/$SCHEME.ipa" -F "uKey= 24af41e3b5e5117e773a733378aefa29" -F "_api_key= 0691c7489e57a5158796f6e1e7e988bd" -F "installType=2" -F "password=123456" -F "updateDescription=abc" http://qiniu-storage.pgyer.com/apiv1/app/upload
