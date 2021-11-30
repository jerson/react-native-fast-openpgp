default: test

test:
	yarn test

upgrade: upgrade-libs upgrade-flatbuffers

upgrade-libs:
	./scripts/upgrade_bridge_libs.sh

upgrade-flatbuffers:
	./scripts/upgrade_bridge_flatbuffers.sh
